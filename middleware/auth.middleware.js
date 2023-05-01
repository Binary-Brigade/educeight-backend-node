import jwt from "jsonwebtoken";

const jwtSecret = process.env.JWT_SECRET;

export const authenticateJwt = async (req, res, next) => {
  try {
    let token = req.header("Authorization");
    if (!token) return res.status(403).json({ error: "Access denied" });
    if (token.startsWith("Bearer")) {
      token = token.slice(7, token.length).trimLeft();
    }
    const verified = jwt.verify(token, jwtSecret);
    req.user = verified;
    next();
  } catch (err) {
    console.log(err);
  }
};

// middleware to set user roles
// export const setUserRoles = (req, res, next) => {
//   try {
//     if (req.user && req.user.role) {
//       req.role = req.user.role;
//     } else {
//       req.role = "user";
//     }
//   } catch (err) {
//     console.log(err);
//   }
//   next();
// };

export const setUserRoles = (req, res, next) => {
  try {
    let token = req.header("Authorization");
    if (!token) {
        return res.status(403).json({error: "AccessDenied"})
    }
       if (token.startsWith("Bearer")) {
         token = token.slice(7, token.length).trimLeft();
       }
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.role = decoded.role;
    next();
  } catch (err) {}
};

export const requireSuperAdmin = (req, res, next) => {
  try {
    if (req.role !== "superAdmin") {
      return res
        .status(403)
        .json({ error: "you are not authorized to perform this action" });
    }
  } catch (err) {
    console.log(err);
  }
  next();
};

export const requireAdmin = (req, res, next) => {
  if (req.role !== "admin" && req.role !== "superAdmin") {
    return res.status(403).json({error: "Unauthorized. Only admins and superAdmins can perform this action"});
  }
  next();
};

export const requireTeacher = (req, res, next) => {
  try {
    if (
      req.role !== "admin" &&
      req.role !== "superAdmin" &&
      req.role !== "teacher"
    ) {
      return res.status(403).json({ error: "Unauthorized action" });
    }
    next();
  } catch (err) {}
};

export const requireParent = (req, res, next) => {
  try {
    if (
      req.role !== "admin" &&
      req.role !== "superAdmin" &&
      req.role !== "teacher" &&
      req.role !== "parent"
    ) {
      return res.status(403).json({ error: "Unauthorized action" });
    }
    next();
  } catch (err) {
    console.log(err);
  }
};

export const requireStudent = (req, res, next) => {
  try {
    if (
      req.role !== "superAdmin" &&
      req.role !== "admin" &&
      (req.role !== "teacher") & (req.role !== "student")
    ) {
      return res.status(403).json({ error: "Unauthorized action" });
    }
  } catch (err) {
    console.log(err);
  }
};

export const requireUser = (req, res, next) => {
  try {
    if (
      req.role !== "superAdmin" &&
      req.role !== "admin" &&
      req.role !== "teacher" &&
      req.role !== "parent" &&
      req.role !== "student" &&
      req.role !== "user"
    ) {
      return res.status(403).json({ error: "Unauthorized Action" });
    }
    next();
  } catch (err) {
    console.log(err);
  }
};
