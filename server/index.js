require("dotenv").config();
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

const {
  client,
  createTables,
  createCustomer,
  createRestaurant,
  createReservation,
  fetchCustomers,
  fetchRestaurants,
  fetchReservations,
  destroyReservation,
} = require("./db");

app.use(express.json());

app.get("/api/customers", async (req, res, next) => {
  try {
    const customers = await fetchCustomers();
    res.send(customers);
  } catch (err) {
    next(err);
  }
});

app.get("/api/restaurants", async (req, res, next) => {
  try {
    const restaurants = await fetchRestaurants();
    res.send(restaurants);
  } catch (err) {
    next(err);
  }
});

app.get("/api/reservations", async (req, res, next) => {
  try {
    const reservations = await fetchReservations();
    res.send(reservations);
  } catch (err) {
    next(err);
  }
});

app.post("/api/customers/:id/reservations", async (req, res, next) => {
  try {
    const createdRes = await createReservation(req.body);
    res.send(createdRes);
  } catch (err) {
    next(err);
  }
});

app.delete(
  "/api/customers/:customer_id/reservations/:id",
  async (req, res, next) => {
    try {
      await destroyReservation(req.params.id, req.params.customerId);
      res.sendStatus(204);
    } catch (err) {
      next(err);
    }
  }
);
const init = async () => {
  console.log("connecting to database");
  await client.connect();
  console.log("connected to database");
  await createTables();
  console.log("Tables created!");
  const [Ashley, Jeff, Alex, Carbone, Chillis, Centrada] = await Promise.all([
    createCustomer("Ashley"),
    createCustomer("Jeff"),
    createCustomer("Alex"),
    createRestaurant("Carbone"),
    createRestaurant("Chillis"),
    createRestaurant("Centrada"),
  ]);
  const [reservation1, reservation2] = await Promise.all([
    createReservation({
      customerId: Ashley.id,
      restaurantId: Carbone.id,
      date: "02/16/2025",
      party_count: 4,
    }),
    createReservation({
      customerId: Jeff.id,
      restaurantId: Centrada.id,
      date: "02/18/2025",
      party_count: 2,
    }),
  ]);

  let customers = await fetchCustomers();
  console.log(customers);
  let restaurants = await fetchRestaurants();
  console.log(restaurants);
};

app.listen(PORT, () => {
  console.log(`Server alive on port ${PORT}`);
});

init();
