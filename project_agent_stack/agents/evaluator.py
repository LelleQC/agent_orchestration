from autogen import AssistantAgent

def get_evaluator_agent(client):
    """
    Creates and returns an evaluator agent.
    """
    evaluator = AssistantAgent(
        "evaluator",
        llm_config={"client": client},
        system_message="""
        You are an evaluator agent. Your role is to assess the output of other agents.
        You check for correctness, completeness, and quality.
        Provide concise feedback and a score from 1 to 5.
        If the output is code, check for basic syntax errors or logical flaws.
        """
    )
    return evaluator

def evaluate_output(output: str, evaluator_agent: AssistantAgent, user_proxy_agent: "UserProxyAgent"):
    """
    Uses the evaluator agent to assess a given output.
    """
    print("\n--- Starting Evaluation ---")
    
    user_proxy_agent.initiate_chat(
        evaluator_agent,
        message=f"""
        Please evaluate the following output.
        Provide a score from 1 (poor) to 5 (excellent) and a brief justification.

        --- OUTPUT ---
        {output}
        --- END OF OUTPUT ---
        "
    )
    print("--- Evaluation Complete ---")

