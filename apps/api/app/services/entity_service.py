import re
from collections import Counter

TECHNOLOGIES = {
    "python", "javascript", "typescript", "java", "c++", "rust", "go", "ruby",
    "pytorch", "tensorflow", "keras", "scikit-learn", "sklearn", "numpy", "pandas",
    "transformer", "transformers", "bert", "gpt", "llm", "large language model",
    "neural network", "deep learning", "machine learning", "reinforcement learning",
    "graph neural network", "gnn", "cnn", "rnn", "lstm", "GAN", "gan",
    "convolutional neural network", "recurrent neural network",
    "natural language processing", "nlp", "computer vision",
    "blockchain", "ethereum", "smart contract",
    "kubernetes", "docker", "aws", "gcp", "google cloud", "azure",
    "react", "next.js", "nextjs", "vue", "angular", "node.js", "nodejs",
    "postgresql", "mysql", "mongodb", "redis", "elasticsearch",
    "spacy", "nltk", "langchain", "langgraph", "vertex ai", "openai",
    "hugging face", "huggingface", "bert", "roberta", "gpt-4", "gpt-3",
    "image processing", "image segmentation", "object detection",
    "yolo", "resnet", "vgg", "alexnet",
    "gradient descent", "backpropagation", "attention mechanism",
    "random forest", "support vector machine", "svm", "xgboost",
    "logistic regression", "linear regression", "decision tree",
    "clustering", "k-means", "dbscan",
    "data augmentation", "transfer learning", "fine-tuning", "fine tuning",
}

TOPICS = {
    "healthcare", "medical", "clinical", "patient", "diagnosis", "treatment",
    "cancer", "tumor", "disease", "drug", "pharmaceutical", "biomedical",
    "genomics", "proteomics", "bioinformatics", "biotechnology",
    "climate", "environment", "sustainability", "renewable", "energy",
    "autonomous", "self-driving", "robotics", "automation",
    "cybersecurity", "privacy", "encryption", "authentication",
    "finance", "trading", "stock", "market", "portfolio",
    "education", "learning", "student", "classroom",
    "agriculture", "crop", "soil", "farming",
    "space", "astronomy", "satellite", "orbit",
    "manufacturing", "supply chain", "logistics",
    "social network", "recommendation", "search engine",
    "speech", "audio", "voice", "recognition",
    "video", "animation", "graphics", "rendering",
    "quantum", "quantum computing",
    "graph analysis", "network analysis", "social network analysis",
    "prediction", "forecasting", "time series",
    "anomaly detection", "fraud detection",
    "recommendation system", "collaborative filtering",
    "information retrieval", "text mining", "sentiment analysis",
    "knowledge graph", "ontology", "semantic",
    "federated learning", "differential privacy",
    "edge computing", "iot", "internet of things",
}

DATASETS = {
    "imagenet", "cifar", "mnist", "coco", "openimages",
    "pubmed", "arxiv", "wikipedia", "common crawl",
    "kaggle", "uci", "mnli", "squad", "glue", "superglue",
    "mimic", "eicu", "chest x-ray", "retinal",
    "human genome", "protein data bank", "pdb",
    "genbank", "uniprot",
}


def extract_entities(text: str) -> list[dict]:
    entities = []
    seen = Counter()
    text_lower = text.lower()

    # Extract technology entities
    for tech in TECHNOLOGIES:
        pattern = r'\b' + re.escape(tech) + r'\b'
        matches = re.findall(pattern, text_lower)
        if matches:
            count = len(matches)
            if tech not in seen:
                entities.append({
                    "name": tech.title() if len(tech) > 3 else tech.upper(),
                    "type": "TECHNOLOGY",
                    "confidence": min(0.95, 0.7 + count * 0.05),
                })
                seen[tech] = count

    # Extract topic entities
    for topic in TOPICS:
        pattern = r'\b' + re.escape(topic) + r'\b'
        matches = re.findall(pattern, text_lower)
        if matches:
            count = len(matches)
            if topic not in seen:
                entities.append({
                    "name": topic.title(),
                    "type": "TOPIC",
                    "confidence": min(0.95, 0.7 + count * 0.05),
                })
                seen[topic] = count

    # Extract dataset entities
    for dataset in DATASETS:
        pattern = r'\b' + re.escape(dataset) + r'\b'
        matches = re.findall(pattern, text_lower)
        if matches:
            count = len(matches)
            if dataset not in seen:
                entities.append({
                    "name": dataset.upper() if len(dataset) < 6 else dataset.title(),
                    "type": "DATASET",
                    "confidence": min(0.95, 0.75 + count * 0.05),
                })
                seen[dataset] = count

    # Extract capitalized phrases (potential researcher names, paper titles)
    name_pattern = r'\b([A-Z][a-z]+ (?:and |of |for |in |on |the )?[A-Z][a-z]+)\b'
    for match in re.finditer(name_pattern, text):
        name = match.group(1).strip()
        if len(name) > 5 and name not in seen:
            # Check if it looks like a name (common patterns)
            words = name.split()
            if len(words) >= 2 and all(w[0].isupper() for w in words if w.lower() not in ('and', 'of', 'for', 'in', 'on', 'the')):
                entities.append({
                    "name": name,
                    "type": "RESEARCHER",
                    "confidence": 0.65,
                })
                seen[name] = 1

    # Extract "et al." patterns (indicates authors)
    etal_pattern = r'([A-Z][a-z]+)\s+et\s+al\.?'
    for match in re.finditer(etal_pattern, text):
        name = match.group(1)
        if name not in seen:
            entities.append({
                "name": name,
                "type": "RESEARCHER",
                "confidence": 0.7,
            })
            seen[name] = 1

    # Sort by confidence
    entities.sort(key=lambda x: x["confidence"], reverse=True)

    # Limit to top 30
    return entities[:30]
