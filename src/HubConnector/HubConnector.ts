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

import { spinalCore } from 'spinal-core-connectorjs_type';

import { SpinalGraphService } from 'spinal-env-viewer-graph-service';
import { SpinalServiceTicket } from 'spinal-service-ticket';
import { ForgeFileItem } from 'spinal-lib-forgefile';

// get the config
import * as config from '../../config.js';

// connection string to connect to spinalhub
const connectOpt =
  `http://${config.spinalConnector.user}:${config.spinalConnector.password}@${
    config.spinalConnector.host}:${config.spinalConnector.port}/`;

// initialize the connection
const conn = spinalCore.connect(connectOpt);

// get the Model from the spinalhub, "onLoadSuccess" and "onLoadError" are 2
// callback function.
spinalCore.load(conn, config.file.path, onLoadSuccess, onLoadError);

// called network error or file not found
function onLoadError() {
  console.error(`File does not exist in location ${config.file.path}`);
}

// called if connected to the server and if the spinalhub sent us the Model
function onLoadSuccess(forgeFile: ForgeFileItem) {
  SpinalGraphService.setGraphFromForgeFile(forgeFile)
    .then((id) => {
      if (typeof id !== 'undefined') {
        SpinalServiceTicket.init();
      }
    })
    .catch(e => console.error(e));
}
