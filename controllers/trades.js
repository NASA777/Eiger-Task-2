const Trade = require("../models/trades");
const Counter = require("../models/counter");

const createTrade = async (req, res) => {
    try {
        const { type, user_id, symbol, shares, price, timestamp } = req.body;

        // Validate shares
        if (shares < 1 || shares > 100) {
            return res.status(400).send("Shares must be between 1 and 100");
        }

        // Validate type
        if (type !== "buy" && type !== "sell") {
            return res.status(400).send('Invalid type. Must be "buy" or "sell"');
        }

        // Fetch the next available trade id
        const counter = await Counter.findOneAndUpdate(
            { _id: "tradeId" },
            { $inc: { seq: 1 } },
            { new: true, upsert: true }
        );

        // Create new trade object with fetched id
        const newTrade = new Trade({
            id: counter.seq,
            type,
            user_id,
            symbol,
            shares,
            price,
            timestamp,
        });

        // Save trade to MongoDB
        await newTrade.save();

        res.status(201).json(newTrade);
    } catch (err) {
        console.error("Error creating trade", err);
        res.status(500).send("Error creating trade");
    }
};

const getTrades = async (req, res) => {
    try {
        const query = {};
        const { type, user_id } = req.query;

        if (type) {
            query.type = type;
        }

        if (user_id) {
            query.user_id = parseInt(user_id, 10);
        }

        const trades = await Trade.find(query).sort({ id: 1 });

        res.status(200).json(trades);
    } catch (err) {
        console.error("Error fetching trades", err);
        res.status(500).send("Error fetching trades");
    }
};

const getTradeById = async (req, res) => {
    try {
        const tradeId = parseInt(req.params.id, 10);
        const trade = await Trade.findOne({ id: tradeId });

        if (trade) {
            res.status(200).json(trade);
        } else {
            res.status(404).send("ID not found");
        }
    } catch (err) {
        console.error("Error fetching trade", err);
        res.status(500).send("Error fetching trade");
    }
};

const methodNotAllowed = (req, res) => {
    res.status(405).send("Method Not Allowed");
};

module.exports = {
    createTrade,
    getTrades,
    getTradeById,
    methodNotAllowed,
};
