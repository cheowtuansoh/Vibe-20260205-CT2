
import functions_framework
import google.generativeai as genai
import os
import json

# Configure Gemini API
# IMPORTANT: Store your API key securely, e.g., in Google Cloud Secret Manager or Firebase environment config.
# For demonstration, we're using an environment variable.
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))

@functions_framework.http
def generate_itinerary_firebase_function(request):
    """
    Firebase Function to generate a travel itinerary using Google Gemini.

    Receives POST requests with country, days, and interest,
    then uses Gemini to suggest activities.
    """
    if request.method == 'OPTIONS':
        # Allows GET requests from any origin with the Content-Type header and caches preflight response for 3600s
        headers = {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST',
            'Access-Control-Allow-Headers': 'Content-Type',
            'Access-Control-Max-Age': '3600'
        }
        return ('', 204, headers)

    # Set CORS headers for the main request
    headers = {
        'Access-Control-Allow-Origin': '*'
    }

    request_json = request.get_json(silent=True)
    if not request_json:
        return (json.dumps({"message": "Invalid JSON payload"}), 400, headers)

    country = request_json.get('country')
    days = request_json.get('days')
    interest = request_json.get('interest')

    if not all([country, days]):
        return (json.dumps({"message": "Missing required parameters: country, days"}), 400, headers)

    try:
        model = genai.GenerativeModel('gemini-pro')

        prompt = f"Generate a {days}-day travel itinerary for {country} focusing on {interest if interest else 'general sightseeing and culture'}. " 
                 f"For each day, list the top recommended activity based on popular travel websites. " 
                 f"Return the activities as a JSON array of strings, where each string is an activity for one day. " 
                 f"Example: ["Day 1: Explore historic district", "Day 2: Visit local market"]"

        response = model.generate_content(prompt)
        
        # Extract content, assuming it's a JSON string
        gemini_output = response.text.strip()
        
        # Gemini might return markdown, try to clean it
        if gemini_output.startswith('```json'):
            gemini_output = gemini_output.replace('```json', '').replace('```', '').strip()

        daily_activities = json.loads(gemini_output)

        if not isinstance(daily_activities, list):
            raise ValueError("Gemini did not return a JSON array of activities.")

        return (json.dumps({"dailyActivities": daily_activities}), 200, headers)

    except Exception as e:
        print(f"Error generating itinerary: {e}")
        return (json.dumps({"message": f"Internal server error: {str(e)}"}), 500, headers)

