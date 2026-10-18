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

new_post = _posts/$(to)
old_url = $(shell echo $(from) | sed -E 's#^([0-9]{4})-([0-9]{2})-([0-9]{2})-(.+)\.md$$#/\1/\2/\3/\4.html#')
new_slug = $(shell echo $(to) | cut -c12- | sed 's/\.md$$//')
fail = { echo '$(1)' >&2; exit 1; }

define redirect
grep -q '^redirect_from:$$' $(new_post) \
	&& sed -i "/^redirect_from:$$/a\  - $(old_url)" $(new_post) \
	|| sed -i -e "2,/^---$$/{/^---$$/i redirect_from:\n  - $(old_url)" -e '}' $(new_post)
endef

rename: hooks
	$(if $(and $(from),$(to)),,$(error usage: make rename from=<post>.md to=<post>.md))
	git diff --cached --quiet || $(call fail,unstage other changes first)
	git mv _posts/$(from) $(new_post)
	$(redirect)
	git add $(new_post)
	git diff --cached --name-status --find-renames | grep -q '^R.*$(new_post)$$' || $(call fail,rename not detected)
	git commit -m "chore($(new_slug)): rename post"
