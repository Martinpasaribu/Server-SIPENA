import express, { Request, Response, NextFunction } from "express";
import { AuthController } from "../controller/controller_auth";
import { refreshToken, refreshTokenEmployee, } from "../controller/refresh_tokens";

const AuthRouter: express.Router = express.Router();


// semantic meaning


// Auth

AuthRouter.get("/token", refreshToken);
AuthRouter.get("/token-employee", refreshTokenEmployee);
AuthRouter.get("/cek-refresh-token", AuthController.CheckRefreshToken);
AuthRouter.get("/tokens", AuthController.CheckRefreshTokenEmployee);
AuthRouter.post("/login", AuthController.Login);
AuthRouter.post("/login-employee", AuthController.LoginEmployee);
AuthRouter.delete("/logout", AuthController.Logout);
AuthRouter.delete("/logout-employee", AuthController.LogoutEmployee);
AuthRouter.get("/me", AuthController.Me);
AuthRouter.get("/me-employee", AuthController.MeEmployee);


export default AuthRouter;
