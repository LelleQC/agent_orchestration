import os
import weaviate
import weaviate.classes as wvc

def main():
    """
    Connects to Weaviate, sets up a schema, and ingests documents from a directory.
    """
    print("Starting document ingestion process...")

    # Connect to Weaviate
    try:
        client = weaviate.connect_to_local(
            host="localhost",
            port=8081 # Port mapped in docker-compose
        )
        print("Successfully connected to Weaviate.")
    except Exception as e:
        print(f"Error connecting to Weaviate: {e}")
        return

    # Define the collection (schema)
    collection_name = "DocumentChunk"
    if client.collections.exists(collection_name):
        print(f"Collection '{collection_name}' already exists. Deleting and recreating.")
        client.collections.delete(collection_name)

    client.collections.create(
        name=collection_name,
        properties=[
            wvc.Property(name="content", data_type=wvc.DataType.TEXT),
            wvc.Property(name="source", data_type=wvc.DataType.TEXT),
        ]
    )
    print(f"Collection '{collection_name}' created.")

    # Ingest documents from the 'docs_to_ingest' directory
    ingest_dir = "docs_to_ingest"
    if not os.path.exists(ingest_dir):
        print(f"Creating directory '{ingest_dir}' for document ingestion.")
        os.makedirs(ingest_dir)
        # Create a sample file
        with open(os.path.join(ingest_dir, "sample_doc.md"), "w") as f:
            f.write("# Sample Document\n\nThis is a sample document for ingestion.")

    chunks_collection = client.collections.get(collection_name)
    
    print(f"Scanning '{ingest_dir}' for documents...")
    for filename in os.listdir(ingest_dir):
        if filename.endswith(".md"):
            filepath = os.path.join(ingest_dir, filename)
            print(f"Ingesting '{filepath}'...")
            with open(filepath, "r") as f:
                content = f.read()
                
                # Simple chunking (in a real scenario, this would be more sophisticated)
                # For now, we treat the whole file as one chunk.
                chunks_collection.data.insert(
                    properties={
                        "content": content,
                        "source": filename
                    }
                )
    
    print("Document ingestion complete.")
    client.close()

if __name__ == "__main__":
    main()
