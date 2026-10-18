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

rename: hooks
	$(if $(and $(from),$(to)),,$(error usage: make rename from=<post>.md to=<post>.md))
	git diff --cached --quiet || { echo 'unstage other changes first' >&2; exit 1; }
	git mv _posts/$(from) _posts/$(to)
	url=$$(echo $(from) | sed -E 's#^([0-9]{4})-([0-9]{2})-([0-9]{2})-(.+)\.md$$#/\1/\2/\3/\4.html#'); \
	grep -q '^redirect_from:$$' _posts/$(to) \
		&& sed -i "/^redirect_from:$$/a\  - $$url" _posts/$(to) \
		|| sed -i -e "2,/^---$$/{/^---$$/i redirect_from:\n  - $$url" -e '}' _posts/$(to)
	git add _posts/$(to)
	git diff --cached --name-status --find-renames | grep -q '^R.*_posts/$(to)$$' || { echo 'rename not detected' >&2; exit 1; }
	git commit -m "nit($$(echo $(to) | cut -c12- | sed 's/\.md$$//')): rename post"
