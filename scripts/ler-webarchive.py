#!/usr/bin/env python3
"""Abre um .webarchive da Safari e despeja HTML, CSS e JS numa pasta.

Um webarchive é um plist binário da Apple que embrulha a página inteira —
marcação, estilos, fontes e scripts — num arquivo só. É o jeito mais direto
de trazer o código de produção de um site de referência para cá, num
ambiente com saída de rede por lista de permissão.

    python3 scripts/ler-webarchive.py referencia.webarchive -s docs/ref/nome

Depois, para achar o vocabulário de movimento:

    grep -ohE 'cubic-bezier\\([^)]*\\)' docs/ref/nome/*.css | sort | uniq -c | sort -rn
"""

import argparse
import os
import plistlib
import re
from urllib.parse import urlparse

EXTENSAO = {"css": ".css", "javascript": ".js", "html": ".html"}


def extensao_de(mime: str) -> str | None:
    for chave, ext in EXTENSAO.items():
        if chave in mime:
            return ext
    return None


def nome_seguro(url: str, indice: int, ext: str) -> str:
    base = os.path.basename(urlparse(url).path) or f"recurso{indice}"
    base = re.sub(r"[^A-Za-z0-9._-]", "_", base)[:60]
    if not base.endswith(ext):
        base += ext
    return f"{indice:03d}_{base}"


def main() -> None:
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("arquivo")
    ap.add_argument("-s", "--saida", required=True, help="pasta de destino")
    args = ap.parse_args()

    with open(args.arquivo, "rb") as fh:
        arquivo = plistlib.load(fh)

    os.makedirs(args.saida, exist_ok=True)
    principal = arquivo["WebMainResource"]
    with open(os.path.join(args.saida, "index.html"), "wb") as fh:
        fh.write(principal["WebResourceData"])
    print(f"{principal.get('WebResourceURL')}  ->  {args.saida}/")

    contagem: dict[str, int] = {}
    for i, recurso in enumerate(arquivo.get("WebSubresources", [])):
        ext = extensao_de(recurso.get("WebResourceMIMEType", ""))
        if ext is None:
            continue  # imagens e fontes não interessam para ler desenho
        destino = nome_seguro(recurso.get("WebResourceURL", ""), i, ext)
        with open(os.path.join(args.saida, destino), "wb") as fh:
            fh.write(recurso["WebResourceData"])
        contagem[ext] = contagem.get(ext, 0) + 1

    resumo = ", ".join(f"{n}{ext}" for ext, n in sorted(contagem.items())) or "nada"
    print(f"sub-recursos extraídos: {resumo}")
    print("obs.: sites feitos em Framer guardam o CSS inline no index.html")


if __name__ == "__main__":
    main()
