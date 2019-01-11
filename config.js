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

module.exports = {
  spinalConnector: {
    user: process.env.SPINAL_USER_ID || 168, // user id
    password: process.env.SPINAL_USER_ID ||
      "JHGgcz45JKilmzknzelf65ddDadggftIO98P", // user password
    host: process.env.SPINALHUB_IP || "localhost", // can be an ip address
    port: process.env.SPINALHUB_PORT || 7777 // port
  },
  file: {
    // path to a digital twin in spinalhub filesystem
    path: process.env.SPINAL_DTWIN_PATH || '/__users__/admin/Sc',
  },
};