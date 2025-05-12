# routers/terminal.py
from fastapi import APIRouter, WebSocket, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.active_container import ActiveContainer
import docker
import asyncio

router = APIRouter(tags=["Terminal"])

@router.websocket("/{target_id}")
async def websocket_terminal(websocket: WebSocket, target_id: int, db: Session = Depends(get_db)):
    await websocket.accept()

    # Step 1: 查询 active_containers 表
    container_record = db.query(ActiveContainer).filter_by(target_id=target_id).first()
    if not container_record or container_record.status != "running":
        await websocket.send_text("容器未运行或不存在。")
        await websocket.close(code=4000)
        return

    container_id = container_record.container_id
    if not container_id:
        await websocket.send_text("未找到有效的容器 ID。")
        await websocket.close(code=4000)
        return

    try:
        client = docker.from_env()
        container = client.containers.get(container_id)

        async def read_from_docker():
            while True:
                data = await websocket.receive_text()
                cmd = data.strip()
                if not cmd:
                    continue

                # 执行命令，支持流式输出
                exit_code, output = container.exec_run(
                    cmd,
                    stdout=True,
                    stderr=True,
                    stdin=False,
                    tty=False,
                    stream=True  # 若为 False，则一次性返回全部输出
                )

                # 如果是流式输出，逐块发送
                for chunk in output:
                    await websocket.send_text(chunk.decode(errors="ignore"))

                # 可选：结束标识
                # await websocket.send_text("\r\n[Command finished with exit code: {}]\r\n".format(exit_code))

        await read_from_docker()

    except Exception as e:
        await websocket.send_text(f"连接异常: {str(e)}")
        await websocket.close(code=4001)
    finally:
        pass