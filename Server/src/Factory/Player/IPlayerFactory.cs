﻿using AltV.Net;

namespace src.Factory.Player;

public class IPlayerFactory : IEntityFactory<IPlayer>
{
    public IPlayer Create(ICore core, IntPtr entityPointer, ushort id)
    {
        return new IPlayer(core, entityPointer, id);
    }
}