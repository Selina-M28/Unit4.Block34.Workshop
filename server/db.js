
const pg = require ('pg');
const uuid = require ("uuid");
const client = new pg.Client();

const createTables = async() => {
    try{
        const SQL = `
        DROP TABLE IF EXISTS reservation;
        DROP TABLE IF EXISTS customer;
        DROP TABLE IF EXISTS restaurant;
        CREATE TABLE customer(id UUID PRIMARY KEY, name VARCHAR(64) NOT NULL UNIQUE);
        CREATE TABLE restaurant(id UUID PRIMARY KEY, name VARCHAR(128) NOT NULL);
        CREATE TABLE reservation (id UUID PRIMARY KEY, 
        date DATE NOT NULL,
        party_count INTEGER NOT NULL,
        restaurant_id UUID REFERENCES restaurant(id),
        customer_id UUID REFERENCES customer(id)
        ); `;
        await client.query(SQL);
    } catch(err) {
        console.log(err);
    }
};

const createCustomer = async (customerName) => {
    try{
        const SQL =`INSERT INTO customer(id,name) VALUES ($1,$2) RETURNING *; `
        const {rows} = await client.query(SQL, [uuid.v4(), customerName]);
        return rows [0];
    } catch (err) {
        console.log(err);
    }
}

const createRestaurant = async (restaurantName) => {
    try{
        const SQL =`INSERT INTO restaurant(id,name) VALUES ($1,$2) RETURNING *; `
        const {rows} = await client.query(SQL, [uuid.v4(), restaurantName]);
        return rows [0];
    } catch (err) {
        console.log(err);
    }
}

const createReservation = async (reservation) => {
    try{
        const {customerId, restaurantId, date, party_count} = reservation;
        const SQL =`INSERT INTO reservation(id,customer_id, restaurant_id,date,party_count) VALUES ($1,$2,$3,$4,$5) RETURNING *; `
        const {rows} = await client.query(SQL, [uuid.v4(), customerId,restaurantId,date,party_count]);
        return rows [0];
    } catch (err) {
        console.log(err);
    }
}

const fetchCustomers = async () => {
    try{
        const SQL = `SELECT * FROM customer;`
        const {rows} = await client.query(SQL);
        return rows;
    }catch(err){
        console.log(err);
    }
}

const fetchRestaurants = async () => {
    try{
        const SQL = `SELECT * FROM restaurant;`
        const {rows} = await client.query(SQL);
        return rows;
    }catch(err){
        console.log(err);
    }
}

const fetchReservations = async () => {
    try{
        const SQL = `SELECT * FROM reservation;`
        const {rows} = await client.query(SQL);
        return rows;
    }catch(err){
        console.log(err);
    }
}

const destroyReservation = async (Id,customerId) => {
    try{
        const SQL = `DELETE FROM reservations WHERE id=$1 AND customer_id=$2`;
        await client.query(SQL, [Id, customerId])
        return true;
    }catch(err) {
        console.log(err);
    }
};

module.exports ={
    client, createTables,
    createCustomer,
    createRestaurant,
    createReservation,
    fetchCustomers,
    fetchRestaurants,
    fetchReservations,
    destroyReservation
};