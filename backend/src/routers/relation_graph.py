from fastapi import APIRouter
from neo4j_database import driver

router = APIRouter()
@router.get("/test")
async def test_neo4j_connection():
    driver.verify_connectivity()

#获取所有的节点列表
@router.get("/nodes")
async def get_all_nodes():
    session = driver.session()
    result = session.run("MATCH (n) RETURN n limit 20")
    nodes = []
    for record in result:
        node = record.data()["n"]["name"]
        nodes.append(node)
    session.close()
    return nodes

#获取所有的关系列表
@router.get("/relationships")
async def get_all_relationships():
    session = driver.session()
    result = session.run("MATCH ()-[r]->() RETURN r limit 70")
    relationships = []
    for record in result:
        relationship = record.data()["r"][1]
        # relationships列表去重
        if relationship not in relationships:
            relationships.append(relationship)
    session.close()
    return relationships

#根据关系查找相关节点
@router.get("/relationships/{relationship_name}")
async def get_relationships_by_node(relationship_name: str):
    session = driver.session()
    result = session.run(f"MATCH p=()-[r:{relationship_name}]->() RETURN p LIMIT 25")
    relationships = []
    for record in result:
        relationship = record.data()["p"]
        relationships.append(relationship)
    session.close()
    return relationships

#根据节点查找相关关系
@router.get("/nodes/{node_name}")
async def get_nodes_by_relationship(node_name: str):
    session = driver.session()
    result = session.run(f'MATCH p=(n:Node{{name:"{node_name}"}}) -[r]->() RETURN p LIMIT 25')
    nodes = []
    for record in result:
        node = record.data()["p"]
        nodes.append(node)
    session.close()
    return nodes
