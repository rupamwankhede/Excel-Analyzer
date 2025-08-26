const express = require("express");
const router = express.Router();
const { verifyAdmin } = require("../middleware/auth");

let reports = [
  { id: 1, name: "Sales Report Q1", createdAt: new Date() },
  { id: 2, name: "Inventory Report", createdAt: new Date() }
];

let users = [
  { id: 1, name: "Alice", role: "admin" },
  { id: 2, name: "Bob", role: "user" }
];

router.get("/summary", verifyAdmin, (req, res) => {
  res.json({
    totalUsers: users.length,
    totalReports: reports.length,
    recentReports: reports.slice(-5)
  });
});

router.get("/users", verifyAdmin, (req, res) => res.json(users));

router.delete("/users/:id", verifyAdmin, (req, res) => {
  const id = parseInt(req.params.id);
  users = users.filter(u => u.id !== id);
  res.json({ success: true });
});

router.get("/reports", verifyAdmin, (req, res) => res.json(reports));

router.post("/reports", verifyAdmin, (req, res) => {
  const newReport = {
    id: reports.length + 1,
    name: req.body.name || "Untitled Report",
    createdAt: new Date()
  };
  reports.push(newReport);
  res.json(newReport);
});

module.exports = router;
