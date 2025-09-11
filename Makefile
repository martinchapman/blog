prettier:
	npm run prettier

test:
	+docker run -p 4000:4000 -v $(PWD):/site bretfisher/jekyll-serve