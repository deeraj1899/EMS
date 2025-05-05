// queryProfiler.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Department from './models/Department.js'; // Adjust path if needed

dotenv.config();

const runQuery = async () => {
  try {
    await mongoose.connect(process.env.CONNECTION_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to DB");

    const organizationId = '68172e06b9374cfd498782b6'; // 👉 Replace with actual org ID from your DB

    // --------------------------
    // ⚠️ Without optimization
    console.time('Without lean()');
    const unoptimized = await Department.find({ organization: organizationId });
    console.timeEnd('Without lean()');
    console.log(`Returned (unoptimized): ${unoptimized.length} departments`);

    // --------------------------
    // ✅ With optimization (lean)
    console.time('With lean()');
    const optimized = await Department.find({ organization: organizationId }).lean();
    console.timeEnd('With lean()');
    console.log(`Returned (optimized): ${optimized.length} departments`);

    // --------------------------
    // 🔍 Explain the query plan
    const explain = await Department.find({ organization: organizationId }).lean().explain('executionStats');
    console.log("\nExecution Stats:\n", JSON.stringify(explain.executionStats, null, 2));

    await mongoose.disconnect();
    console.log("Disconnected from DB");
  } catch (err) {
    console.error("Error in profiler:", err);
  }
};

runQuery();
