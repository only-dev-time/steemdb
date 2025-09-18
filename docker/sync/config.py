# config.py
import os

CONFIG = {
    # --- Node Configuration ---
    # List of Steem API nodes to use for fetching blocks.
    # The script will distribute load across these nodes when syncing in parallel.
    "steemd_nodes": [
        "https://api.justyy.com",
        "https://api.moecki.online",
        "https://api.pennsif.net",
        "https://api.botsteem.com",
        "https://api2.justyy.com",
        "https://api.steemitdev.com",
       	"https://api.steememory.com",
    ],

    # --- Database Configuration ---
    "mongodb_url": os.getenv("MONGODB_URL", "mongodb://host.docker.internal:27017/"),
    "db_name": os.getenv("DB_NAME", "SteemDB"),
    "collection_name": "SteemData",

    # The number of blocks each worker thread will fetch in a single batch during parallel sync.
    "parallel_batch_size": 50,

    # The threshold for activating parallel sync. If the number of blocks to sync
    # is greater than this value, the script will use all available nodes.
    # Otherwise, it will sync one block at a time.
    "parallel_sync_threshold": 100,

    # --- Logging Configuration ---
    "log_file": "blocks_sync.log",
    "error_log_file": "blocks_error.log"
}

# Override steemd_nodes if STEEMD_URL environment variable is set
STEEMD_URL = os.getenv("STEEMD_URL", None)
if STEEMD_URL:
    # if STEEMD_URL is set, replace the list
    CONFIG["steemd_nodes"] = [STEEMD_URL]
