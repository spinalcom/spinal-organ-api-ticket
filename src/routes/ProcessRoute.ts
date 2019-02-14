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
import { TicketInterface } from 'spinal-models-ticket/declarations/SpinalTicket';

const processRouter = express.Router();

/* GET home page. */
processRouter.get('/processes',  (req, res) => {

  return SpinalServiceTicket.getAllProcessAsync()
    .then(async children => {
      const nodes = [];
      for (const id of children) {
        const node = SpinalGraphService.getNode(id);
        const info = {
          name: node.name.get(),
          id: node.id.get(),
          icon: node.icon.get(),
          categories: SpinalServiceTicket.getCategoriesFromProcess(node.id.get()),
        };
        nodes.push(info);
      }
      for (let i = 0; i < nodes.length; i = i + 1) {
        try {
          const tmpCat = await nodes[i].categories;
          const categories = [];
          for (let j = 0; j < tmpCat.length; j++) {
            categories.push(tmpCat[j][0]);
            for (let k = 0; k < tmpCat[j][0]['children'].length; k++) {
              categories.push(tmpCat[j][0]['children'][k]);
            }
          }
          nodes[i].categories = categories;
        } catch (e) {
          delete nodes[i].categories;
        }
      }

      return res.send(nodes);
    })
    .catch(e => {
      console.error(e);
      return res.send([]);
    });
});

processRouter.get('/node/:id', (req, res) => {
  return SpinalGraphService.findNode(req.params.id).then(node => {
    return res.json({ name: node.name.get(), id: node.id.get() });
  });
});

processRouter.get('/sentences/:id', async (req, res) => {
  const id = req.params.id;
  const sentence = await SpinalServiceTicket.getCategoriesFromProcess(id);
  const result = [];
  for (let j = 0; j < sentence.length; j++) {
    result.push(sentence[j][0]);
    for (let k = 0; k < sentence[j][0]['children'].length; k++) {
      result.push(sentence[j][0]['children'][k]);
    }
  }
  return res.json(result);
});

processRouter.post('/ticket', async (req, res) => {
  const ticket: TicketInterface = JSON.parse(req.body.ticket);
  ticket['processId'] = req.body.processId;
  ticket['from'] = 'mobile application';
  ticket['userId'] = req.body.userId;

  const ticketId: string = SpinalServiceTicket.createTicket(ticket);
  try {
    const added: boolean = await SpinalServiceTicket
      .addTicketToProcessWithUser(ticketId, req.body.processId, req.body.userId);

    SpinalServiceTicket.addLocationToTicket(ticketId, req.body.roomId);

    return res.json({ ok: added });
  } catch (e) {
    return res.status(500).send(e.message);
  }
});

processRouter.get('/tickets/:id', async (req, res) => {
  console.log(req.params);
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

    res.json({ error: e.message });
  }
});
export { processRouter };
