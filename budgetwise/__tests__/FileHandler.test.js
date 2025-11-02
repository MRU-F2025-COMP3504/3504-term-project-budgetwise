import { authenticateUser } from "../lib/helpers/uploadHelper.js";
import supabase from "../lib/helpers/DatabaseConnector.js";

jest.mock("../lib/helpers/DatabaseConnector.js", () => ({
  auth: { signInWithPassword: jest.fn() },
}));

test("authenticateUser returns user", async () => {
  const mockUser = { id: "123" };
  supabase.auth.signInWithPassword.mockResolvedValueOnce({
    data: { user: mockUser },
    error: null,
  });
  const result = await authenticateUser();
  expect(result).toBe(mockUser);
});
