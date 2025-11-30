"""
Create MongoDB indexes for optimal query performance
"""
import asyncio
import os
from motor.motor_asyncio import AsyncIOMotorClient
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

async def create_indexes():
    # Connect to MongoDB
    mongo_url = os.environ['MONGO_URL']
    client = AsyncIOMotorClient(mongo_url)
    db = client[os.environ['DB_NAME']]
    
    print("Creating indexes...")
    
    # Conversations collection indexes
    await db.conversations.create_index('id', unique=True)
    print("✓ Created unique index on conversations.id")
    
    await db.conversations.create_index([('updated_at', -1)])
    print("✓ Created index on conversations.updated_at")
    
    # Messages collection indexes
    await db.messages.create_index('conversation_id')
    print("✓ Created index on messages.conversation_id")
    
    await db.messages.create_index([('conversation_id', 1), ('created_at', 1)])
    print("✓ Created compound index on messages (conversation_id, created_at)")
    
    print("\nAll indexes created successfully!")
    client.close()

if __name__ == "__main__":
    asyncio.run(create_indexes())
