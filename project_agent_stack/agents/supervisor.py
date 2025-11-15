import os
import weaviate
from dotenv import load_dotenv
from autogen import AssistantAgent, UserProxyAgent
from autogen.oai.client import OpenAIClient

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

    # Configuration for the OpenAI-compatible client
    client = OpenAIClient(
        api_key=os.getenv("OPENAI_API_KEY", "devkey"),
        base_url=os.getenv("OLLAMA_BASE_URL", "http://localhost:11434/v1")
    )

    # The supervisor agent that orchestrates the work
    supervisor = AssistantAgent(
        "supervisor",
        llm_config={"client": client},
        system_message="You are a supervisor agent. You orchestrate the work between other agents and tools. You are in charge. You can use the 'search_knowledge_base' tool to find relevant information."
    )

    # The user proxy agent, which represents the human user
    user_proxy = UserProxyAgent(
        "user_proxy",
        code_execution_config=False,
        human_input_mode="NEVER"
    )
    
    # Register the search function as a tool
    user_proxy.register_function(
        function_map={
            "search_knowledge_base": search_knowledge_base
        }
    )

    # Start a conversation
    user_proxy.initiate_chat(
        supervisor,
        message="""
        Search the knowledge base for information about 'modularity'.
        Based on the results, what is the importance of modularity in software engineering?
        Please be concise.
        """
    )

if __name__ == "__main__":
    main()
