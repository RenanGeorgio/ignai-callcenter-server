'use strict';

import twilio from 'twilio';
import find from 'lodash/find.js';
import map from 'lodash/map.js';
import difference from 'lodash/difference.js';

const WORKSPACE_NAME = 'TaskRouter Node Workspace';
const HOST = process.env.HOST;
const EVENT_CALLBACK = `${HOST}/events`;
const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;

export default function() {
  function initClient(existingWorkspaceSid) {
    if (!existingWorkspaceSid) {
      this.client = twilio(ACCOUNT_SID, AUTH_TOKEN).taskrouter.v1.workspaces;
    } else {
      this.client = twilio(ACCOUNT_SID, AUTH_TOKEN)
        .taskrouter.v1.workspaces(existingWorkspaceSid);
    }
  }

  function createWorker(opts) {
    const ctx = this;

    return this.client.activities.list({ friendlyName: 'Idle' })
      .then(function(idleActivity) {
        return ctx.client.workers.create({
          friendlyName: opts.name,
          attributes: JSON.stringify({
            products: opts.products,
            contact_uri: opts.phoneNumber,
          }),
          activitySid: idleActivity.sid,
        });
      });
  }

  function createWorkflow() {
    const ctx = this;
    const config = this.createWorkflowConfig();

    return ctx.client.workflows.create({
      friendlyName: 'Sales',
      assignmentCallbackUrl: `${HOST}/call/assignment`,
      fallbackAssignmentCallbackUrl: `${HOST}/call/assignment`,
      taskReservationTimeout: 15,
      configuration: config,
    }).then(function(workflow) {
      return ctx.client.activities.list()
        .then(function(activities) {
          const idleActivity = find(activities, { friendlyName: 'Idle' });
          const offlineActivity = find(activities, { friendlyName: 'Offline' });

          return {
            workflowSid: workflow.sid,
            activities: {
              idle: idleActivity.sid,
              offline: offlineActivity.sid,
            },
            workspaceSid: ctx.client._solution.sid,
          };
        });
    });
  }

  function createTaskQueues() {
    const ctx = this;

    return this.client.activities.list()
      .then(function(activities) {
        const busyActivity = find(activities, { friendlyName: 'Busy' });
        const reservedActivity = find(activities, { friendlyName: 'Reserved' });

        return Promise.all([
          ctx.client.taskQueues.create({
            friendlyName: 'SMS',
            targetWorkers: 'products HAS "ProgrammableSMS"',
            assignmentActivitySid: busyActivity.sid,
            reservationActivitySid: reservedActivity.sid,
          }),
          ctx.client.taskQueues.create({
            friendlyName: 'Voice',
            targetWorkers: 'products HAS "ProgrammableVoice"',
            assignmentActivitySid: busyActivity.sid,
            reservationActivitySid: reservedActivity.sid,
          }),
          ctx.client.taskQueues.create({
            friendlyName: 'Default',
            targetWorkers: '1==1',
            assignmentActivitySid: busyActivity.sid,
            reservationActivitySid: reservedActivity.sid,
          }),
        ]).then(function(queues) {
          ctx.queues = queues;
        });
      });
  }

  function createWorkers() {
    const ctx = this;

    return Promise.all([
      ctx.createWorker({
        name: 'Bob',
        phoneNumber: process.env.BOB_NUMBER,
        products: ['ProgrammableSMS'],
      }),
      ctx.createWorker({
        name: 'Alice',
        phoneNumber: process.env.ALICE_NUMBER,
        products: ['ProgrammableVoice'],
      }),
    ]).then(function(workers) {
      const bobWorker = workers[0];
      const aliceWorker = workers[1];
      const workerInfo = {};

      workerInfo[process.env.ALICE_NUMBER] = aliceWorker.sid;
      workerInfo[process.env.BOB_NUMBER] = bobWorker.sid;

      return workerInfo;
    });
  }

  function createWorkflowActivities() {
    const ctx = this;
    const activityNames = ['Idle', 'Busy', 'Offline', 'Reserved'];

    return ctx.client.activities.list()
      .then(function(activities) {
        const existingActivities = map(activities, 'friendlyName');

        const missingActivities = difference(activityNames, existingActivities);

        const newActivities = map(missingActivities, function(friendlyName) {
          return ctx.client.activities.create({
            friendlyName: friendlyName,
            available: 'true',
          });
        });

        return Promise.all(newActivities);
      }).then(function() {
        return ctx.client.activities.list();
      });
  }

  function createWorkflowConfig() {
    const queues = this.queues;

    if (!queues) {
      throw new Error('Queues must be initialized.');
    }

    const defaultTarget = {
      queue: find(queues, { friendlyName: 'Default' }).sid,
      timeout: 30,
      priority: 1,
    };

    const smsTarget = {
      queue: find(queues, { friendlyName: 'SMS' }).sid,
      timeout: 30,
      priority: 5,
    };

    const voiceTarget = {
      queue: find(queues, { friendlyName: 'Voice' }).sid,
      timeout: 30,
      priority: 5,
    };

    const rules = [
      {
        expression: 'selected_product=="ProgrammableSMS"',
        targets: [smsTarget, defaultTarget],
        timeout: 30,
      },
      {
        expression: 'selected_product=="ProgrammableVoice"',
        targets: [voiceTarget, defaultTarget],
        timeout: 30,
      },
    ];

    const config = {
      task_routing: {
        filters: rules,
        default_filter: defaultTarget,
      },
    };

    return JSON.stringify(config);
  }

  function setup() {
    const ctx = this;

    ctx.initClient();

    return this.initWorkspace()
      .then(createWorkflowActivities.bind(ctx))
      .then(createTaskQueues.bind(ctx))
      .then(createWorkflow.bind(ctx))
      .then(function(workspaceInfo) {
        return ctx.createWorkers().then(function(workerInfo) {
          return [workerInfo, workspaceInfo];
        });
      });
  }

  function findByFriendlyName(friendlyName) {
    const client = this.client;

    return client.list().then(function(data) {
      return find(data, { friendlyName: friendlyName });
    });
  }

  function deleteByFriendlyName(friendlyName) {
    const ctx = this;

    return this.findByFriendlyName(friendlyName).then(function(workspace) {
      if (workspace.remove) {
        return workspace.remove();
      }
    });
  }

  function createWorkspace() {
    return this.client.create({
      friendlyName: WORKSPACE_NAME,
      EVENT_CALLBACKUrl: EVENT_CALLBACK,
    });
  }

  function initWorkspace() {
    const ctx = this;
    const client = this.client;

    return ctx.findByFriendlyName(WORKSPACE_NAME)
      .then(function(workspace) {
        let newWorkspace;

        if (workspace) {
          newWorkspace = ctx.deleteByFriendlyName(WORKSPACE_NAME)
            .then(createWorkspace.bind(ctx));
        } else {
          newWorkspace = ctx.createWorkspace();
        }

        return newWorkspace;
      }).then(function(workspace) {
        ctx.initClient(workspace.sid);

        return workspace;
      });
  }

  return {
    createTaskQueues,
    createWorker,
    createWorkers,
    createWorkflow,
    createWorkflowActivities,
    createWorkflowConfig,
    createWorkspace,
    deleteByFriendlyName,
    findByFriendlyName,
    initClient,
    initWorkspace,
    setup,
  };
}
