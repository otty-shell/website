"""PROTOTYPE — serve the visual-language experiment on localhost."""

from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path


WEBSITE_DIR = Path(__file__).resolve().parents[2]
PORT = 4173


class PrototypeHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=WEBSITE_DIR, **kwargs)


if __name__ == "__main__":
    server = ThreadingHTTPServer(("127.0.0.1", PORT), PrototypeHandler)
    print(
        "OTTY visual-language prototype: "
        f"http://127.0.0.1:{PORT}/prototypes/web-visual-language/?variant=A"
    )
    try:
        server.serve_forever()
    except KeyboardInterrupt:
        pass
    finally:
        server.server_close()
