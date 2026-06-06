""" Fresh D Bot common functions """

# Standard library imports
import re
import random
import json
import os
from os.path import join, dirname

# Third party imports
from dotenv import load_dotenv

def get_env(env_key, filepath):
    """ Get environment variables """
    dotenv_path = join(dirname(filepath), '.env')
    load_dotenv(dotenv_path)
    try:
        return os.getenv(env_key)
    except Exception as e:
        return e

def get_matching_categories(text):
    """ Returns list of quote categories triggered by the comment text """
    with open('../utils/triggers.json', 'r', encoding='utf-8') as f:
        trigger_map = json.load(f)

    matched = []
    for category, patterns in trigger_map.items():
        for pattern in patterns:
            if re.search(pattern, text, re.IGNORECASE):
                matched.append(category)
                break  # one match per category is enough

    return matched

def get_random_quote(categories=None):
    """ Returns a random quote from the matching categories, or from all quotes if none given """
    with open('../utils/quotes.json', 'r', encoding='utf-8') as f:
        all_quotes = json.load(f)

    if categories:
        pool = []
        for cat in categories:
            pool.extend(all_quotes.get(cat, []))
    else:
        pool = [q for quotes in all_quotes.values() for q in quotes]

    return random.choice(pool) if pool else None

def is_keyword_mentioned(text):
    """ Checks if any trigger word is present in the text """
    return bool(get_matching_categories(text))

def get_username(author):
    """ Handles author names when comment was deleted before the bot could reply """
    if not author:
        return '[deleted]'
    return author.name
