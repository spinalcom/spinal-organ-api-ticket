"use strict";
/*
 * Copyright 2019 SpinalCom - www.spinalcom.com
 *
 *  This file is part of SpinalCore.
 *
 *  Please read all of the following terms and conditions
 *  of the Free Software license Agreement ("Agreement")
 *  carefully.
 *
 *  This Agreement is a legally binding contract between
 *  the Licensee (as defined below) and SpinalCom that
 *  sets forth the terms and conditions that govern your
 *  use of the Program. By installing and/or using the
 *  Program, you agree to abide by all the terms and
 *  conditions stated or referenced herein.
 *
 *  If you do not agree to abide by these terms and
 *  conditions, do not demonstrate your acceptance and do
 *  not install or use the Program.
 *  You should have received a copy of the license along
 *  with this file. If not, see
 *  <http://resources.spinalcom.com/licenses.pdf>.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const spinal_service_ticket_1 = require("spinal-service-ticket");
const spinal_env_viewer_graph_service_1 = require("spinal-env-viewer-graph-service");
const processRouter = express.Router();
exports.processRouter = processRouter;
/* GET home page. */
processRouter.get('/processes', (req, res) => {
    return spinal_service_ticket_1.SpinalServiceTicket.getAllProcessAsync()
        .then((children) => __awaiter(this, void 0, void 0, function* () {
        const nodes = [];
        for (const id of children) {
            const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getNode(id);
            const info = {
                name: node.name.get(),
                id: node.id.get(),
                icon: node.icon.get(),
                categories: spinal_service_ticket_1.SpinalServiceTicket.getCategoriesFromProcess(node.id.get()),
            };
            nodes.push(info);
        }
        for (let i = 0; i < nodes.length; i = i + 1) {
            try {
                const tmpCat = yield nodes[i].categories;
                const categories = [];
                for (let j = 0; j < tmpCat.length; j++) {
                    categories.push(tmpCat[j][0]);
                    for (let k = 0; k < tmpCat[j][0]['children'].length; k++) {
                        categories.push(tmpCat[j][0]['children'][k]);
                    }
                }
                nodes[i].categories = categories;
            }
            catch (e) {
                delete nodes[i].categories;
            }
        }
        return res.send(nodes);
    }))
        .catch(e => {
        console.error(e);
        return res.send([]);
    });
});
processRouter.get('/node/:id', (req, res) => {
    return spinal_env_viewer_graph_service_1.SpinalGraphService.findNode(req.params.id).then(node => {
        return res.json({ name: node.name.get(), id: node.id.get() });
    });
});
processRouter.get('/sentences/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const id = req.params.id;
    const sentence = yield spinal_service_ticket_1.SpinalServiceTicket.getCategoriesFromProcess(id);
    const result = [];
    for (let j = 0; j < sentence.length; j++) {
        result.push(sentence[j][0]);
        for (let k = 0; k < sentence[j][0]['children'].length; k++) {
            result.push(sentence[j][0]['children'][k]);
        }
    }
    return res.json(result);
}));
processRouter.post('/ticket', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const ticket = JSON.parse(req.body.ticket);
    ticket['processId'] = req.body.processId;
    ticket['from'] = 'mobile application';
    ticket['userId'] = req.body.userId;
    ticket['bimId'] = req.body.roomId;
    ticket['username'] = req.body.username;
    ticket['creationDate'] = Date.now();
    const ticketId = spinal_service_ticket_1.SpinalServiceTicket.createTicket(ticket);
    try {
        const added = yield spinal_service_ticket_1.SpinalServiceTicket
            .addTicketToProcessWithUser(ticketId, req.body.processId, req.body.userId);
        spinal_service_ticket_1.SpinalServiceTicket.addLocationToTicket(ticketId, req.body.roomId);
        return res.json({ ok: added });
    }
    catch (e) {
        return res.status(500).send(e.message);
    }
}));
processRouter.get('/tickets/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
    try {
        const tickets = yield spinal_service_ticket_1.SpinalServiceTicket.getTicketForUser(req.params.id);
        const result = [];
        for (let i = 0; i < tickets.length; i = i + 1) {
            const ticket = {};
            if (tickets[i].hasOwnProperty('name')) {
                ticket['name'] = tickets[i]['name'].get();
                ticket['color'] = tickets[i]['color'].get();
            }
            result.push(ticket);
        }
        res.json(result);
    }
    catch (e) {
        res.json({ error: e.message });
    }
}));
//# sourceMappingURL=ProcessRoute.js.map