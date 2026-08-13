import { describe, expect, it } from "vitest";
import { getLycheeAsset } from "./lychee-binary.mjs";

describe("getLycheeAsset", () => {
	it("selects the matching Linux binary", () => {
		expect(getLycheeAsset("linux", "x64")).toMatchObject({
			archive: "lychee-x86_64-unknown-linux-musl.tar.gz"
		});
	});

	it("rejects unsupported platforms", () => {
		expect(() => getLycheeAsset("freebsd", "x64")).toThrow(
			"Lychee does not support freebsd/x64 in this project."
		);
	});
});
