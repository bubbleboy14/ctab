from dydx3 import constants
from accountant import Accountant, generate_now_iso
from agent import Agent
from backend import start, spew

def get(path, ag=None):
	from dez.http import fetch
	ag = ag or Agent()
	hz = ag.credHead()
	host = constants.API_HOST_GOERLI.split("//")[1]
	print("fetching:", host, path)
	fetch(host, path, port=443, secure=True, headers=hz, cb=spew, dispatch=True)

def accountant(): # doesn't work - "Invalid id"
	acc = Accountant()
	ag = Agent()
	start()

def accountById(): # doesn't work - "Unauthorized"
	ag = Agent()
	get("/v3/accounts/" + ag.id() + "?ethereumAddress=" + ag.client.default_address, ag)

def accounts(): # works
	get("/v3/accounts")

if __name__ == "__main__":
	accountant()
	#accountById()
	#accounts()