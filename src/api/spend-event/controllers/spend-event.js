'use strict';

/**
 * spend-event controller
 */

const { createCoreController } = require('@strapi/strapi').factories;

module.exports = createCoreController('api::spend-event.spend-event',
    ({ strapi }) => ({

        //default
        async find(ctx) {
            const event = await strapi.entityService.findMany('api::spend-event.spend-event', {
                filters: {
                    userId: ctx.state.user.id
                }
            })

            return event;
        },

        async create(ctx) {
            // Ensure we always attach the authenticated user's id
            const userId = ctx?.state?.user?.id;
            if (!userId) {
                return ctx.unauthorized('Missing authenticated user');
            }

            // Strapi v4 sends payload as { data: {...} } from the admin UI
            const payload = ctx.request.body?.data ?? ctx.request.body ?? {};

            const created = await strapi.entityService.create('api::spend-event.spend-event', {
                data: {
                    ...payload,
                    userId,
                },
            });

            const sanitized = await this.sanitizeOutput(created, ctx);
            ctx.body = sanitized;
        },


        //custom
        async sync(ctx) {
            return await strapi.service('api::spend-event.spend-event').sync(ctx);
        }
    })
);
