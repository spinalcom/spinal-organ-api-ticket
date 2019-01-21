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

import * as express from 'express';
import { SpinalServiceTicket } from 'spinal-service-ticket';
import { SpinalGraphService } from 'spinal-env-viewer-graph-service';
import { TicketInterface } from '../../../spinal-models-ticket/declarations/SpinalTicket';

const processRouter = express.Router();

/* GET home page. */
processRouter.get('/processes', (req, res) => {

  const processId = SpinalServiceTicket.getAllProcess();
  const nodes = [];
  for (const id of processId) {
    const node = SpinalGraphService.getNode(id);
    const info = {
      name: node.name.get(),
      id: node.id.get(),
      icon: node.icon.get()
    };
    nodes.push(info);
  }

  res.send(nodes);
});

processRouter.get('/node/:id', (req, res) => {
  return SpinalGraphService.findNode(req.params.id).then(node => {
    return res.json({name: node.name.get(), id: node.id.get()});
  });
});

processRouter.get('/sentences/:id', async (req, res) => {
  const id = req.params.id;
  const sentence = await SpinalServiceTicket.getCategoriesFromProcess(id, []);
  const result = [];
  console.log(sentence[0].children);
  res.json(sentence);
});

processRouter.post('/ticket', async (req, res) => {
  const ticket: TicketInterface = JSON.parse(req.body.ticket);
  const ticketId: string = SpinalServiceTicket.createTicket(ticket);
  try {
    const added: boolean = await SpinalServiceTicket
      .addTicketToProcessWithUser(
        ticketId,
        req.body.processId,
        req.body.userId,
      );
    res.json({ok: added});
  } catch (e) {
    res.status(500).send(e.message);
  }
});

processRouter.get('/tickets/:id', async (req, res) => {
  try {

    const tickets = await SpinalServiceTicket.getTicketForUser(req.params.id);
    const result = [];

    for (let i = 0; i < tickets.length; i = i + 1) {
      const ticket = {};
      if (tickets[i].hasOwnProperty('name')) {
        ticket['name'] = tickets[i]['name'].get();
      }
      result.push(ticket);
    }
    res.json(result);
  } catch (e) {

    res.json({error: e.message});
  }
});
export { processRouter };
