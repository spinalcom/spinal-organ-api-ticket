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
    const processId = spinal_service_ticket_1.SpinalServiceTicket.getAllProcess();
    const nodes = [];
    for (const id of processId) {
        const node = spinal_env_viewer_graph_service_1.SpinalGraphService.getNode(id);
        const info = { name: node.name.get(), id: node.id.get() };
        nodes.push(info);
    }
    res.send(nodes);
});
processRouter.get('/sentences/:id', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const id = req.params.id;
    const sentence = yield spinal_service_ticket_1.SpinalServiceTicket.getDefaultSentenceFromProcess(id);
    const result = [];
    for (let i = 0; i < sentence.length; i = i + 1) {
        result.push(sentence[i].name.get());
    }
    res.send(result);
}));
processRouter.post('/ticket', (req, res) => __awaiter(this, void 0, void 0, function* () {
    const ticket = JSON.parse(req.body.ticket);
    const ticketId = spinal_service_ticket_1.SpinalServiceTicket.createTicket(ticket);
    try {
        console.log(ticket);
        console.log(spinal_service_ticket_1.SpinalServiceTicket.getAllProcess());
        const added = yield spinal_service_ticket_1.SpinalServiceTicket
            .addTicketToProcess(ticketId, req.body.processId);
        res.json({ ok: added });
    }
    catch (e) {
        res.status(500).send(e.message);
    }
}));
//# sourceMappingURL=ProcessRoute.js.map