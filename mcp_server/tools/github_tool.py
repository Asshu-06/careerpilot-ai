from mcp_instance import mcp
import requests


@mcp.tool()
def analyze_github(username: str):
    """
    Analyze a GitHub user's public profile.
    """

    url = f"https://api.github.com/users/{username}"

    response = requests.get(url)

    if response.status_code != 200:
        return {
            "error": "GitHub user not found."
        }

    user = response.json()

    repos_url = user["repos_url"]

    repos = requests.get(repos_url).json()

    repo_names = []

    languages = set()

    for repo in repos:

        repo_names.append(repo["name"])

        if repo["language"]:
            languages.add(repo["language"])

    return {
        "username": user["login"],
        "name": user["name"],
        "public_repositories": user["public_repos"],
        "followers": user["followers"],
        "following": user["following"],
        "top_languages": list(languages),
        "repositories": repo_names
    }