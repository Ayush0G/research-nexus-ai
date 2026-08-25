def extract_relationships(text: str, entities: list[dict]) -> list[dict]:
    relationships = []
    seen = set()
    text_lower = text.lower()

    entity_names = {e["name"].lower(): e for e in entities}

    # Pattern: entity A "uses" entity B
    use_patterns = [
        (r'uses?\s+(?:the\s+)?(.+?)(?:\s+for|\s+to|\s+in|\s+on|\.|,)', "USES"),
        (r'applies?\s+(?:the\s+)?(.+?)(?:\s+for|\s+to|\s+in|\.|,)', "USES"),
        (r'employs?\s+(?:the\s+)?(.+?)(?:\s+for|\s+to|\s+in|\.|,)', "USES"),
        (r'utilizes?\s+(?:the\s+)?(.+?)(?:\s+for|\s+to|\s+in|\.|,)', "USES"),
        (r'based on\s+(.+?)(?:\s+for|\s+to|\s+in|\.|,)', "USES"),
        (r'implement(?:ed|s|ing)?\s+(?:the\s+)?(.+?)(?:\s+for|\s+to|\s+in|\.|,)', "IMPLEMENTS"),
        (r'develop(?:ed|s|ing)?\s+(?:a\s+|an\s+|the\s+)?(.+?)(?:\s+for|\s+to|\s+in|\.|,)', "IMPLEMENTS"),
    ]

    for pattern, rel_type in use_patterns:
        for match in re.finditer(pattern, text_lower):
            target_text = match.group(1).strip()[:50]
            # Find which entity this matches
            for name, entity in entity_names.items():
                if name in target_text or target_text in name:
                    # Find source entity (usually the first one mentioned before this match)
                    source_pos = match.start()
                    source_entity = _find_nearest_entity(text_lower, source_pos, entity_names, exclude=entity["name"])
                    if source_entity:
                        key = (source_entity["name"], rel_type, entity["name"])
                        if key not in seen:
                            relationships.append({
                                "source": source_entity["name"],
                                "relationship": rel_type,
                                "target": entity["name"],
                                "confidence": 0.7,
                            })
                            seen.add(key)

    # Connect technologies to topics they appear near
    tech_entities = [e for e in entities if e["type"] == "TECHNOLOGY"]
    topic_entities = [e for e in entities if e["type"] == "TOPIC"]
    dataset_entities = [e for e in entities if e["type"] == "DATASET"]

    for tech in tech_entities:
        for topic in topic_entities:
            if _are_near(text_lower, tech["name"].lower(), topic["name"].lower()):
                key = (tech["name"], "USED_FOR", topic["name"])
                if key not in seen:
                    relationships.append({
                        "source": tech["name"],
                        "relationship": "USED_FOR",
                        "target": topic["name"],
                        "confidence": 0.75,
                    })
                    seen.add(key)

        for dataset in dataset_entities:
            if _are_near(text_lower, tech["name"].lower(), dataset["name"].lower()):
                key = (tech["name"], "USED_WITH", dataset["name"])
                if key not in seen:
                    relationships.append({
                        "source": tech["name"],
                        "relationship": "USED_WITH",
                        "target": dataset["name"],
                        "confidence": 0.7,
                    })
                    seen.add(key)

    # Connect researchers to topics/technologies near their names
    researcher_entities = [e for e in entities if e["type"] == "RESEARCHER"]
    for researcher in researcher_entities:
        for topic in topic_entities + tech_entities:
            if _are_near(text_lower, researcher["name"].lower(), topic["name"].lower(), window=300):
                key = (researcher["name"], "RESEARCHES", topic["name"])
                if key not in seen:
                    relationships.append({
                        "source": researcher["name"],
                        "relationship": "RESEARCHES",
                        "target": topic["name"],
                        "confidence": 0.65,
                    })
                    seen.add(key)

    # Connect related topics
    for i, t1 in enumerate(topic_entities):
        for t2 in topic_entities[i+1:]:
            if _are_near(text_lower, t1["name"].lower(), t2["name"].lower(), window=200):
                key = (t1["name"], "RELATED_TO", t2["name"])
                if key not in seen:
                    relationships.append({
                        "source": t1["name"],
                        "relationship": "RELATED_TO",
                        "target": t2["name"],
                        "confidence": 0.6,
                    })
                    seen.add(key)

    relationships.sort(key=lambda x: x["confidence"], reverse=True)
    return relationships[:50]


def _are_near(text: str, term1: str, term2: str, window: int = 500) -> bool:
    pos1 = text.find(term1)
    pos2 = text.find(term2)
    if pos1 == -1 or pos2 == -1:
        return False
    return abs(pos1 - pos2) < window


def _find_nearest_entity(text: str, position: int, entity_names: dict, exclude: str, max_dist: int = 300) -> dict | None:
    best = None
    best_dist = max_dist
    for name, entity in entity_names.items():
        if entity["name"].lower() == exclude.lower():
            continue
        pos = text.rfind(name, max(0, position - max_dist), position)
        if pos != -1:
            dist = position - pos
            if dist < best_dist:
                best_dist = dist
                best = entity
    return best


import re
