# routers/chat.py
from fastapi import APIRouter, Depends, HTTPException ,Body
from sqlalchemy.orm import Session
from database import get_db
from models.target import Target
from openai import OpenAI
import os

router = APIRouter(tags=["Chat"])

client = OpenAI(api_key="lm-studio", base_url="http://192.168.1.171:12341/v1")

@router.get("/")
async def chat_list():
    ''' 这里可以返回可用的聊天模型列表'''
    try:
        response = client.models.list()
        return response
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))



@router.post("/completions")
async def chat_completions(request = Body()):
    try:
        response = client.chat.completions.create(**request)
        return response.choices[0].message.content
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# 似乎不支持上传文件
@router.post("/hint")
async def get_hint(target_id: int, question: str, db: Session = Depends(get_db)):
    target = db.query(Target).get(target_id)
    if not target:
        raise HTTPException(status_code=404, detail="靶场不存在")

    # 读取答案文件内容
    answer_file = os.path.join(target.file_path, "README.zh-cn.md")
    with open(answer_file, "r") as f:
        answer_content = f.read()

    prompt = f"""
        你是一个网络安全教学助手，请根据以下靶场答案内容，回答用户的提问。
        请不要直接透露答案，而是给予适当提示。

        【靶场答案】：
        {answer_content}

        【用户问题】：
        {question}
        """

    try:

        response = client.chat.completions.create(
            model="qwen3-4b",
            messages=[
                {
                    "role": "user", 
                    "content":[
                        {
                            "type":"text",
                            "text": prompt,
                        },
                    ] 
                }
            ]

        )
        return {"hint": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/study-plan")
async def generate_study_plan(topic: str):
    prompt = f"""
        请你为我制定一个关于 "{topic}" 的详细学习计划,包含7天的内容。
        每天分为上午和下午，每半天提供一个具体任务。
        输出格式如下：

        ```json
        [
        {{
            "day": "Day 1",
            "tasks": [
            {{ "time": "上午", "task": "学习基础概念" }},
            {{ "time": "下午", "task": "完成实验环境搭建" }}
            ]
        }},
        ...
        ]
        请确保内容实用、循序渐进，并适合初学者。
        /no_think
        """
    try:
        response = client.chat.completions.create(
            model="qwen3-0.6b",
            messages=[{"role": "user", "content": prompt}],
        )

        return {"plan": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/knowledge-graph")
async def knowledge_graph(target_id: int, db: Session = Depends(get_db)):
    target = db.query(Target).get(target_id)
    if not target:
        raise HTTPException(status_code=404, detail="靶场不存在")

    prompt = f"""
        你是一个网络安全知识图谱构建助手。
        请根据以下靶场信息，分析其可能涉及的知识点，并以 JSON 形式返回知识图谱结构。

        【靶场名称】：{target.name}
        【靶场分类】：{target.category}
        【靶场描述】：{target.description}

        请返回以下格式：
        ```json
        {{
        "nodes": [{{"id": "node1", "label": "SQL注入原理"}}],
        "edges": [{{"from": "node1", "to": "node2", "label": "导致"}}]
        }}
        ```
        要求：
        至少包含 5 个知识点
        使用中文标签
        明确各知识点之间的依赖或因果关系
        """
    try:
        response = client.chat.completions.create(
        model="qwen3-0.6b",
        messages=[{"role": "user", "content": prompt}]
        )

        return {"graph": response.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))