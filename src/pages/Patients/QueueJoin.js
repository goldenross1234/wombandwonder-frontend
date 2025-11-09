import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../../config/api";

const QueueJoin = () => {
  const [queueNum, setQueueNum] = useState(null);
  const [loading, setLoading] = useState(true);

  const joinQueue = async () => {
    try {
      const res = await axios.post(`${API}/queue-join/`, {
        name: "Guest"
      });

      setQueueNum(res.data.queue_number);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    joinQueue();
  }, []);

  return (
    <div style={{ textAlign: "center", padding: "50px" }}>
      <h2>❤️ Womb & Wonder Queue System</h2>

      {loading && <p>Joining the queue...</p>}

      {!loading && queueNum && (
        <h1>Your Queue Number: <span>{queueNum}</span></h1>
      )}
    </div>
  );
};

export default QueueJoin;
