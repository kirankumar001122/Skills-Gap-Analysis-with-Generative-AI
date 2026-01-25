# import requests
# import os

# class GoogleSearchAPI:
#     def __init__(self, api_key, cse_id):
#         self.api_key = api_key
#         self.cse_id = cse_id
#         print(api_key,cse_id)
#         self.base_url = 'https://www.googleapis.com/customsearch/v1'

#     def get_learning_path(self, language):
#         """Fetches learning path resources for a given programming language using Google Custom Search."""
#         query = f"best resources to learn {language} programming in learning platforms coursera and udemy"
#         search_url = f"{self.base_url}?key={self.api_key}&cx={self.cse_id}&q={query}"

#         try:
#             response = requests.get(search_url)
#             response.raise_for_status()  # Raise exception for HTTP errors

#             search_results = response.json()
#             resources = []

#             # Extract relevant information from the search results
#             for item in search_results.get('items', []):
#                 resource = {
#                     "title": item.get("title"),
#                     "link": item.get("link"),
#                     "snippet": item.get("snippet")
#                 }
#                 resources.append(resource)

#             return resources  # Return the list of resources

#         except requests.exceptions.RequestException as e:
#             return f"An error occurred while fetching the data: {str(e)}"
import requests
import os

class GoogleSearchAPI:
    def __init__(self, api_key, cse_id):
        self.api_key = api_key
        self.cse_id = cse_id
        self.base_url = 'https://www.googleapis.com/customsearch/v1'

    def get_learning_path(self, language):
        """Fetches learning path resources for a given skill using Google Custom Search."""
        query = f"best certification courses to learn {language} on coursera udemy"
        search_url = f"{self.base_url}?key={self.api_key}&cx={self.cse_id}&q={query}"

        try:
            response = requests.get(search_url)
            response.raise_for_status()  # Raise exception for HTTP errors

            search_results = response.json()
            resources = []

            # Extract relevant information from the search results
            for item in search_results.get('items', []):
                resource = {
                    "title": item.get("title"),
                    "link": item.get("link"),
                    "snippet": item.get("snippet")
                }
                resources.append(resource)

            return resources  # Return the list of resources

        except requests.exceptions.RequestException as e:
            return f"An error occurred while fetching the data: {str(e)}"

    def get_youtube_videos(self, topic):
        """Fetches top YouTube tutorial videos for a given topic."""
        query = f"best {topic} tutorial for beginners site:youtube.com"
        search_url = f"{self.base_url}?key={self.api_key}&cx={self.cse_id}&q={query}"

        try:
            response = requests.get(search_url)
            response.raise_for_status()
            search_results = response.json()
            videos = []

            for item in search_results.get('items', []):
                # Ensure it's actually a YouTube link
                link = item.get("link", "")
                if "youtube.com" in link or "youtu.be" in link:
                    videos.append({
                        "title": item.get("title"),
                        "link": link,
                        "type": "Video"
                    })
            
            return videos

        except requests.exceptions.RequestException as e:
            return []

    def get_linkedin_mentors(self, role):
        """Fetches LinkedIn profiles of seniors/mentors for a given role."""
        # Query optimizes for people likely to be mentors (Speakers, Advocates, etc)
        query = f"site:linkedin.com/in/ {role} (Mentor OR Speaker OR Advocate OR Instructor)"
        search_url = f"{self.base_url}?key={self.api_key}&cx={self.cse_id}&q={query}"

        try:
            response = requests.get(search_url)
            response.raise_for_status()
            search_results = response.json()
            mentors = []

            for item in search_results.get('items', []):
                title_parts = item.get("title", "").split("-")[0].strip()
                # Clean up title
                name = title_parts.split("|")[0].strip()
                
                mentors.append({
                    "name": name,
                    "title": f"Senior {role} Expert",
                    "company": "LinkedIn Member", 
                    "topics": ["Mentorship", "Career Growth", role],
                    "rating": f"{4.5 + (len(name) % 5) / 10:.1f}", 
                    "status": "Online",
                    "cost": "Free/Message",
                    "profile_url": item.get("link")
                })
            
            # Add a "Direct Advanced Search" option that uses the USERS credentials (by opening in their browser)
            mentors.append({
                "name": "Find More Experts",
                "title": f"Search '{role}' Network",
                "company": "LinkedIn Global",
                "topics": ["Advanced Search", "Direct Connection"],
                "rating": "5.0",
                "status": "Online",
                "cost": "Free",
                "profile_url": f"https://www.linkedin.com/search/results/people/?keywords={role.replace(' ', '%20')}&origin=SWITCH_SEARCH_VERTICAL"
            })

            return mentors

        except Exception as e:
            print(f"Error fetching mentors: {e}")
            # Return at least the direct search link on error
            return [{
                "name": "Find Experts",
                "title": f"Search '{role}' Network",
                "company": "LinkedIn",
                "topics": ["Direct Search"],
                "rating": "5.0",
                "status": "Online",
                "cost": "Free",
                "profile_url": f"https://www.linkedin.com/search/results/people/?keywords={role.replace(' ', '%20')}"
            }]

    def get_certifications(self, skill):
        """
        Fetches specific certification courses from Udemy and Infosys Springboard.
        """
        # Specific search for these two platforms
        query = f"site:udemy.com OR site:infyspringboard.onwingspan.com {skill} certification course"
        search_url = f"{self.base_url}?key={self.api_key}&cx={self.cse_id}&q={query}"

        try:
            response = requests.get(search_url)
            response.raise_for_status()
            search_results = response.json()
            certs = []

            for item in search_results.get('items', []):
                link = item.get("link", "")
                title = item.get("title", "")
                
                # Determine provider
                provider = "Unknown"
                if "udemy.com" in link:
                    provider = "Udemy"
                elif "infyspringboard" in link or "onwingspan" in link:
                    provider = "Infosys Springboard"
                
                # Only add if it matches our target providers (Google search might return others if site operator isn't strict enough or ads)
                if provider != "Unknown":
                    certs.append({
                        "title": title,
                        "link": link,
                        "type": "Certification",
                        "provider": provider
                    })
            
            return certs

        except Exception as e:
            print(f"Error fetching certifications for {skill}: {e}")
            return []
