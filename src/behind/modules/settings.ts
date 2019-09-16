import * as express from "express";
import {Settings} from "../entitiy/settings";
import {formatAPIResponse} from "../util/response-formatter";

const SettingsRouter = express.Router();

SettingsRouter.get("/:module.:field", async (req: express.Request, res: express.Response) => {
  const { module, field } = req.params;
  const dbConnection = req.db;
  const values = await dbConnection.mongoManager.find(Settings, { name: `${module}.${field}` });

  formatAPIResponse(res, values[0]);
});

export { SettingsRouter };