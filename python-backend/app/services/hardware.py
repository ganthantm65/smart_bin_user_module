import asyncio
import random

async def unlock_physical_bin(unit_id: str, bin_id: str) -> bool:
    """MOCK IoT: Simulates sending an unlock command to the ESP32."""
    print(f"🔌 [IoT MOCK] Opening {bin_id} servo on unit {unit_id}...")
    await asyncio.sleep(1.0)
    return True

async def get_delta_weight(unit_id: str) -> float:
    """MOCK IoT: Simulates the ESP32 calculating weight after a deposit."""
    print(f"⚖️ [IoT MOCK] Calculating delta weight for {unit_id}...")
    await asyncio.sleep(2.0)
    
    mock_weight = round(random.uniform(0.1, 3.5), 2)
    print(f"✅ [IoT MOCK] Final item weight: {mock_weight} kg")
    return mock_weight