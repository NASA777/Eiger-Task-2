const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");

// const mdbMS = require("mongodb-memory-server");
const ConnectionBase = require("./connection-base");
// const mongoServer = new mdbMS.MongoMemoryServer();
const Trades = require("../models/trades");

mongoose.Promise = global.Promise;

const connect = async () => {
    try {
        const mongoServer = await MongoMemoryServer.create(); // Properly initialize the MongoMemoryServer
        const mongoUri = mongoServer.getUri();

        const mongooseOpts = {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        };

        await mongoose.connect(mongoUri, mongooseOpts);

        mongoose.connection.on("error", (e) => {
            if (e.message.code === "ETIMEDOUT") {
                console.log(e);
                mongoose.connect(mongoUri, mongooseOpts);
            }
            console.log(e);
        });

        mongoose.connection.once("open", () => {
            console.log(`MongoDB successfully connected to ${mongoUri}`);
        });

        return mongoose.connection;
    } catch (err) {
        console.error("Error connecting to MongoDB", err);
        throw err;
    }
};

class MongooseConnection extends ConnectionBase {
    getConnection() {
        if (this.promise) {
            return this.promise;
        }
        this.promise = connect(this.promise).then((connection) => {
            this.connection = connection;
            return connection;
        });
        return this.promise;
    }

    async clearDatabase() {
        return Trades.deleteMany();
    }

    async closeConnection() {
        return this.connection.close();
    }
}

module.exports = MongooseConnection;
