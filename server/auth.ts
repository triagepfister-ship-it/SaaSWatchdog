import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { storage } from "./storage-db";
import { User as SelectUser } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

// Initialize default users on startup
const INITIAL_USERS = [
  { username: "Anvesh", password: "viewpoint" },
  { username: "Stephen", password: "viewpoint" },
  { username: "Calvin", password: "viewpoint" },
  { username: "Brian", password: "viewpoint" },
  { username: "Steve", password: "viewpoint" },
  { username: "test", password: "test" },
];

async function initializeUsers() {
  const existingUsers = await storage.getAllUsers();
  
  // Only initialize if no users exist
  if (existingUsers.length === 0) {
    for (const user of INITIAL_USERS) {
      await storage.createUser(user);
    }
  }
}

export function setupAuth(app: Express) {
  // Initialize users
  initializeUsers();

  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET!,
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await storage.getUserByUsername(username);
      if (!user || user.password !== password) {
        return done(null, false);
      }
      return done(null, user);
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: string, done) => {
    const user = await storage.getUser(id);
    done(null, user || null);
  });

  app.post("/api/login", passport.authenticate("local"), (req, res) => {
    const { password, ...userWithoutPassword } = req.user!;
    res.status(200).json(userWithoutPassword);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { password, ...userWithoutPassword } = req.user!;
    res.json(userWithoutPassword);
  });
}
