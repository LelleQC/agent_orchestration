import inspect
from autogen.oai.client import OpenAIClient
print(inspect.getfullargspec(OpenAIClient.__init__))
