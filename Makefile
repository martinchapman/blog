prettier:
	bun run prettier

build:
	bun run check
	bun run build

test: build
	+docker run -p 4000:4000 -v $(PWD):/site bretfisher/jekyll-serve:stable-20260315-2119a31

hooks:
	git config core.hooksPath .githooks

sign:
	.githooks/pre-commit _posts/*.md
