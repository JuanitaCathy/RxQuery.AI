# 🏥 RxQuery.AI - Your AI Powered Drug information finder! ( Pharmacist but AI )

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104.0-009688.svg)](https://fastapi.tiangolo.com)
[![Next.js](https://img.shields.io/badge/Next.js-14.0-000000.svg)](https://nextjs.org)
[![MindsDB](https://img.shields.io/badge/MindsDB-Latest-FF6B6B.svg)](https://mindsdb.com)

## 🌟 Live Demo
UPCOMING....

## 🎯 What is RxQuery?

RxQuery is an intelligent, AI-powered drug information finder and medicine assistant (think of a pharmacy simulator?) that provides instant, reliable drug consultation through an intuitive interface. 
Think pharmacy AI with specialized medical knowledge. It's deeply integrated with MindsDB's Knowledge Bases, Agents, AI Tables, and Evaluation Tools, for reliable drug insights powered by semantic search and LLM Agents!

⚠️ Note: RxQuery.AI is not a substitute for professional medical advice. Please consult actual doctors, thanks :)

### ✨ Key Features
**General Purpose Assistant**: RxAssistant (via AI Table)
**AI Agents:**
- 🔍 **Drug Classification** - Instantly classify medications (Antibiotic, Analgesic, etc.)
- 💊 **Smart Recommendations** - Get personalized drug suggestions based on symptoms
- ⚠️ **Side Effects Checker** - Comprehensive side effects analysis
- 🛡️ **Allergy-Safe Search** - Find safe alternatives for patients with allergies
**Command based input**:
- ⌨️ **Command-based Interaction** - Use simple slash commands like /classify, /recommend, etc.
- 🎙️ **Voice Interaction** - Talk to RxQuery for hands-free health queries
- 🎨 **Beautiful UI/UX** - Chat-based interface with real-time updates

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, TypeScript, Tailwind CSS, Framer Motion, Shadcn, MVPBlocks
- **Backend**: FastAPI, Python, Pydantic
- **🧠 MindsDB**

   -  `CREATE KNOWLEDGE_BASE, INSERT INTO, CREATE INDEX`(chromadb)

   - **CHAINED Multi AGENTS** using `CREATE AGENT` for each feature (/classify, /recommend, /side-effects, etc.)

   - `EVALUATE KNOWLEDGE_BASE` with Groq for document scoring

   - `CREATE JOB` to ingest drug data periodically
   - `SELECT ... WHERE content LIKE ` in semanticss!

   - `metadata_columns` to enable hybrid semantic + SQL filtering

   - `CREATE MODEL rx_assistant` with OpenAI for reasoning and classification

   - **KB_EVALUATE**: Groq LLM, **AI TABLES**: OpenAI, **AGENTS**: OpenAI, Ollama (experimental, model removed)
   - 🧪 Editor: Our MindsDB SQL Editor code is included as reference for building/debugging Agents and KB queries.

p.s **KNOWLEDGE BASES, AGENTS AND AI TABLES** powered by MindsDB!

### 🛠️ MindsDB Deep Dive~
RxQuery leverages MindsDB's advanced AI capabilities, especially:
- 📚 Knowledge Bases → Drug databases and symptom mappings to help agents answer accurately

- 🧠 Agents → Modular AI agents like:

`classify_agent, recommend_agent, side_effects_agent, allergy_agent, history_agent`

- 💾 AI Tables → `rx_assistant` that we use for general queries uses Mindsdb Table ( Power of AI by abstracting AI models as Generative AI Tables.)

### Evaluation via Groq

To benchmark agent speed and consistency, we also experimented with Groq for lightning-fast transformer inference. This gave insights into model!

### Editor Code Included

For reference and reproducibility, we’ve also included our MindsDB SQL/Editor code (used to create agents, AI tables, and knowledge bases) in this repository. You’ll find exact prompts, configurations, and MindsDB commands to recreate or extend the project.

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 18+

### Backend Setup
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Frontend Setup
```bash
cd frontend/rxquery
npm install
npm run dev
```

### Usage Examples
| Command         | Example                   | Result                                                |
| --------------- | ------------------------- | ----------------------------------------------------- |
| `/classify`     | `/classify paracetamol`   | → *"Analgesic / Antipyretic"*                         |
| `/recommend`    | `/recommend headache`     | → *"Paracetamol 500mg every 6 hours"*                 |
| `/side-effects` | `/side-effects Ibuprofen` | → *"Stomach upset, kidney issues with long-term use"* |
| `/allergy`      | `/allergy penicillin`     | → *"Try Azithromycin (macrolide class)"*              |
| `/general`      | `/general tired and dizzy`| → *"Drink warm water, eat light foods and take dolo." |              |


## 🎥 Screenshots

| Feature | Screenshot |
|---------|------------|
UPCOMING....

## 🔮 Future Roadmap

- [ ] Prescription management
- [ ] Multi-language support

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- MindsDB team for the amazing AI platform
- Kaggle for the dataset
- Open source community for inspiration


*🌟 Making Medical Knowledge Accessible to Everyone, Everywhere.*
