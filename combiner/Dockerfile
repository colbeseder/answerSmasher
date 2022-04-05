FROM python:3.8-slim-buster

# Create app directory
WORKDIR /usr/app
COPY combiner/requirements.txt requirements.txt
RUN pip3 install -r requirements.txt
RUN command python3 -m spacy download en_core_web_sm


# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY combiner/src/ .

EXPOSE 5000
CMD [ "bash", "start.sh" ]