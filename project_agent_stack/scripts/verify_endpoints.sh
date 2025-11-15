#!/bin/bash
echo "Verifying service endpoints..."

# Verify Redis
echo -n "Checking Redis... "
if redis-cli -u redis://localhost:6379 ping | grep -q PONG; then
    echo "OK"
else
    echo "Failed"
fi

# Verify Weaviate
echo -n "Checking Weaviate... "
if curl -s http://localhost:8081/v1/.well-known/ready | grep -q "200"; then
    echo "OK"
else
    echo "Failed"
fi

# Verify Ollama (if running)
if [ "$( docker ps -q -f name=project_agent_stack-ollama-1 )" ]; then
    echo -n "Checking Ollama... "
    if curl -s http://localhost:11434/api/tags | grep -q "models"; then
        echo "OK"
    else
        echo "Failed"
    fi
fi

# Verify vLLM (if running)
if [ "$( docker ps -q -f name=project_agent_stack-vllm-1 )" ]; then
    echo -n "Checking vLLM... "
    if curl -s http://localhost:8001/v1/models | grep -q "data"; then
        echo "OK"
    else
        echo "Failed"
    fi
fi

echo "Verification complete."
