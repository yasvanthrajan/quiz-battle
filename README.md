# 🎮 Quiz Battle – Creative DevOps Edition 🔥

Welcome to **Quiz Battle**, a one-of-a-kind web quiz game that blends creativity, color, and full-fledged DevOps automation!  
Built during my internship at **Elevate Labs**, this isn’t just another project — it’s a **live, animated experience** powered by Flask, styled with vibrant effects, and deployed like a pro via Docker + GitHub Actions.

---

## 🌟 Features That Set It Apart

✨ 100% Custom UI Design  
🌗 **Dark Mode** toggle with smooth animations  
🔄 **Live Questions** from Open Trivia DB API (No hardcoded Qs!)  
🧠 "Surrender Anytime" button that ends the battle & shows smart score message  
🎆 Floating particle backgrounds, animated card pulses, sound effects  
💬 Personalized player name & real-time score display

---

## 🛠️ Tech Stack & DevOps Workflow

| Layer         | Tech Used                     |
|---------------|-------------------------------|
| Frontend      | HTML, CSS, JavaScript         |
| Backend       | Python + Flask                |
| CI/CD         | GitHub Actions                |
| Container     | Docker + Docker Hub           |
| API           | Open Trivia DB                |

🔁 **CI/CD Pipeline:**  
- Every `git push` triggers a GitHub Action  
- 🐳 Builds the Docker image  
- 🏷 Tags it as `latest`  
- 🚀 Pushes to Docker Hub

---

## 🚀 Run It Your Way

### 💻 Local (Python)

```bash
git clone https://github.com/yasvanthrajan/quiz-battle.git
cd quiz-battle
pip install flask
python app.py
Then visit 👉 http://localhost:5050
### 🐳 Docker (Recommended – No Setup!)
docker pull yasvanth123/quiz-battle:latest
docker run -p 5050:5050 yasvanth123/quiz-battle:latest
