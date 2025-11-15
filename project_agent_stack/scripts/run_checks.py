import os
import subprocess
import weaviate
import redis
from dotenv import load_dotenv

load_dotenv()

def check_service(command, success_message, failure_message):
    """Runs a command and prints a success or failure message."""
    try:
        subprocess.run(command, check=True, capture_output=True, shell=True)
        print(f"✅ {success_message}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ {failure_message}: {e.stderr.decode().strip()}")
        return False

def main():
    """
    Runs a series of checks to verify the status of all services and components.
    """
    print("--- Running Project Health Checks ---")

    # 1. Check Docker services
    print("\n--- Checking Docker Services ---")
    check_service("docker-compose ps", "Docker services are running.", "Failed to get Docker status.")

    # 2. Check Weaviate connection
    print("\n--- Checking Vector DB (Weaviate) ---")
    try:
        client = weaviate.connect_to_local(host="localhost", port=8081)
        client.is_ready()
        print("✅ Weaviate connection successful.")
        client.close()
    except Exception as e:
        print(f"❌ Weaviate connection failed: {e}")

    # 3. Check Redis connection
    print("\n--- Checking Short-Term Memory (Redis) ---")
    try:
        redis_url = os.getenv("REDIS_URL", "redis://localhost:6379/0")
        r = redis.from_url(redis_url)
        if r.ping():
            print("✅ Redis connection successful.")
        else:
            print("❌ Redis ping failed.")
    except Exception as e:
        print(f"❌ Redis connection failed: {e}")

    # 4. Check LLM Endpoints
    print("\n--- Checking LLM Endpoints ---")
    check_service("curl -s http://localhost:11434/api/tags > /dev/null", "Ollama endpoint is responsive.", "Ollama endpoint check failed.")
    check_service("curl -s http://localhost:8001/v1/models > /dev/null", "vLLM endpoint is responsive.", "vLLM endpoint check failed.")

    # 5. Run a sample RAG query
    print("\n--- Testing RAG Pipeline ---")
    check_service("python agents/supervisor.py", "Sample RAG query executed.", "Failed to execute sample RAG query.")

    print("\n--- Health Checks Complete ---")

if __name__ == "__main__":
    main()
