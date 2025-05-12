import asyncio
import websockets
import docker
import fastapi

app = fastapi.FastAPI()

# 初始化 Docker 客户端
client = docker.from_env()

def get_container():
    try:
        container = client.containers.get("my_ubuntu")
        if container.status != "running":
            container.start()
        return container
    except docker.errors.NotFound:
        print("[+] Creating new container...")
        container = client.containers.create(
            image="ubuntu:latest",
            stdin_open=True,
            tty=True,
            command="/bin/bash",
            name="my_ubuntu"
        )
        container.start()
        return container

async def terminal_handler(websocket, path):
    print("[+] Client connected")
    container = get_container()

    async def read_from_docker():
        # 每次执行一条命令
        while True:
            try:
                # 等待客户端发送命令
                message = await websocket.recv()
                print(f"[CMD] Received command: {message}")

                # 执行命令并流式获取输出
                exit_code_gen, output_gen = container.exec_run(
                    ["sh", "-c", message],
                    stdout=True,
                    stderr=True,
                    stdin=False,
                    tty=False,
                    stream=True
                )

                full_output = ""
                for chunk in output_gen:
                    decoded = chunk.decode('utf-8', errors='ignore')
                    full_output += decoded
                    await websocket.send(decoded)

                # 可选：发送结束标志
                await websocket.send("\r\n[END]\r\n")

            except Exception as e:
                print("[-] Error executing command:", str(e))
                break

    try:
        await read_from_docker()
    except websockets.exceptions.ConnectionClosed:
        print("[-] Client disconnected")

# 启动 WebSocket 服务器
start_server = websockets.serve(
    terminal_handler,
    "0.0.0.0",
    8765,
    ping_interval=None
)

print("🚀 WebSocket command server started at ws://localhost:8765")
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()