import os
import sys
import weaviate
from dotenv import load_dotenv
from autogen import AssistantAgent, UserProxyAgent
import openai

# Add the path to the robot_tool.py script
sys.path.append(os.path.abspath('project_household_robot/simulation/xlerobot_simulation/sim_env'))

from robot_tool import initialize_robot, shutdown_robot, get_robot_image, set_robot_joint_position, set_robot_base_velocity
import cv2

# Load environment variables from .env file
load_dotenv()

def search_knowledge_base(query: str) -> str:
    """
    Searches the Weaviate vector database for a given query.
    """
    print(f"Searching knowledge base for: '{query}'")
    try:
        client = weaviate.connect_to_local(host="localhost", port=8081)
        chunks_collection = client.collections.get("DocumentChunk")
        
        response = chunks_collection.query.near_text(
            query=query,
            limit=3
        )
        
        results = []
        for item in response.objects:
            results.append(f"Source: {item.properties['source']}\nContent: {item.properties['content']}\n---")
            
        client.close()
        
        if not results:
            return "No relevant documents found in the knowledge base."
            
        return "\n".join(results)
        
    except Exception as e:
        return f"Error connecting to or querying Weaviate: {e}"


def main():
    """
    Main function to run the AutoGen supervisor agent.
    """
    print("Starting AutoGen Supervisor...")

    # Initialize the robot
    initialize_robot()

    # Configuration for the LLM
    # IMPORTANT: Replace with your actual API key and model name
    llm_config = {
        "model": "gpt-4",  # Or any other suitable model
        "api_key": os.getenv("OPENAI_API_KEY", "YOUR_API_KEY"),
    }

    # The supervisor agent that orchestrates the work
    supervisor = AssistantAgent(
        "supervisor",
        llm_config=llm_config,
        system_message="You are a supervisor agent. You orchestrate the work between other agents and tools. You are in charge. You can use the 'search_knowledge_base' tool to find relevant information. You can also control a robot with the following tools: 'get_robot_image', 'set_robot_joint_position', 'set_robot_base_velocity'."
    )

    # The user proxy agent, which represents the human user
    user_proxy = UserProxyAgent(
        "user_proxy",
        code_execution_config=False,
        human_input_mode="NEVER"
    )
    
    # Register the tools
    user_proxy.register_function(
        function_map={
            "search_knowledge_base": search_knowledge_base,
            "get_robot_image": get_robot_image,
            "set_robot_joint_position": set_robot_joint_position,
            "set_robot_base_velocity": set_robot_base_velocity,
        }
    )

    # Start a conversation
    try:
        user_proxy.initiate_chat(
            supervisor,
            message="""
            Get an image from the robot's camera and save it to a file named 'supervisor_camera_output.png'.
            """
        )
    finally:
        # Shutdown the robot
        shutdown_robot()


if __name__ == "__main__":
    main()
