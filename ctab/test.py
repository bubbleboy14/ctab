from dydx3 import constants
from dez.http import fetch
from accountant import Accountant, generate_now_iso
from agent import Agent
from backend import start, spew

def get(path, ag=None):
	hz = {}
	ag = ag or Agent()
	ak = ag.apiCreds()
	hz["DYDX-API-KEY"] = ak["key"]
	hz["DYDX-PASSPHRASE"] = ak["passphrase"]
	ts = hz["DYDX-TIMESTAMP"] = generate_now_iso()
	hz["DYDX-SIGNATURE"] = ag.signature("/v3/accounts", ts)
	host = constants.API_HOST_GOERLI.split("//")[1]
	print("fetching:", host, path)
	print("headers:", hz)
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
	#accountant()
	#accountById()
	accounts()